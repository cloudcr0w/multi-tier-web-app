import base64, boto3

NAMESPACE = "CrowProject/CloudFront"
DIST_ID = "E1MN6R9BS8CXF4"
FIELDS = ["timestamp","c-ip","cs-method","cs-uri-stem","sc-status",
          "x-edge-detailed-result-type","r-host","sr-reason"]
IDX_SR = FIELDS.index("sr-reason")
cw = boto3.client("cloudwatch", region_name="us-east-1")

def handler(event, context):
    failovers = 0
    for rec in event.get("Records", []):
        data = base64.b64decode(rec["kinesis"]["data"]).decode("utf-8", errors="ignore")
        for line in data.strip().split("\n"):
            parts = line.split("\t")
            if len(parts) != len(FIELDS): 
                continue
            if parts[IDX_SR].startswith("Failover:"):
                failovers += 1
    if failovers:
        cw.put_metric_data(
            Namespace=NAMESPACE,
            MetricData=[{
                "MetricName": "OriginFailovers",
                "Dimensions": [{"Name":"DistributionId","Value":DIST_ID}],
                "Unit": "Count",
                "Value": failovers
            }]
        )
    return {"failovers": failovers}
