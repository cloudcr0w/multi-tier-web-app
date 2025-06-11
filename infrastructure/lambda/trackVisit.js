exports.handler = async (event) => {
  const headers = event.headers;
  const ip = event.requestContext?.identity?.sourceIp || 'unknown';
  const userAgent = headers['User-Agent'] || headers['user-agent'] || 'unknown';
  const referer = headers['Referer'] || headers['referer'] || 'direct';
  const page = JSON.parse(event.body || '{}')?.page || 'home';

  console.log(`📈 Visit logged: ${ip}, ${userAgent}, ${referer}, page: ${page}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Visit logged' })
  };
};
