import { gql, request } from 'graphql-request';

const url = 'https://api.studio.thegraph.com/query/89559/ensregistry/v0.0.4';

const baseQuery = gql`
  query fetchRecentRegistrations($targetTimestamp: BigInt!, $skip: Int!) {
    nameRegistereds(
      where: { blockTimestamp_gte: $targetTimestamp }
      orderBy: blockNumber
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      name
      owner
      transactionHash
      blockNumber
      blockTimestamp
    }
  }
`;

async function fetchSubgraphData() {
  const msInOneDay = 24 * 60 * 60 * 1000;
  const targetTimestamp = Math.floor((Date.now() - msInOneDay) / 1000); // Convert to seconds

  let skip = 0;
  const results = [];
  let hasMore = true;

  console.log(`Started fetching at ${new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}`)
  
  while (hasMore) {
    const data = await request(url, baseQuery, { targetTimestamp, skip });
    const nameRegistereds = data.nameRegistereds;
    results.push(...nameRegistereds);
    
    console.log(`Fetched ${nameRegistereds.length} items at skip ${skip}`);

    if (nameRegistereds.length < 100) {
      hasMore = false; // No more data to fetch
    } else {
      skip += 100; // Fetch next page
    }
  }

  console.log('Fetched data length:', results.length);
  console.log('First item timestamp:', results[0]?.blockTimestamp);
  console.log('Last item timestamp:', results[results.length - 1]?.blockTimestamp);
  console.log(results)

  return results;
}

export { fetchSubgraphData }
