import { gql, request } from 'graphql-request'


const url = 'https://api.studio.thegraph.com/query/89559/ensregistry/v0.0.4'
const query = gql`{
  nameRegistereds(first: 50, orderBy: blockNumber, orderDirection: desc) {
    id
    name
    owner
    transactionHash
    blockNumber
  }
}`
async function fetchSubgraphData() {
  return await request(url, query)
}

export default fetchSubgraphData
      