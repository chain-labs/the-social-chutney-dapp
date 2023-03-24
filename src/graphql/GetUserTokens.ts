import { gql } from "urql";

const TokenQuery = gql`
  query UserTokenQuery($id: Bytes, $address: Bytes) {
    users(where: { account: $id }) {
      id
      minted(where: { collection_: { address: $address } }) {
        tokenId
      }
    }
  }
`;

export default TokenQuery;
