import { gql, useQuery } from '@apollo/client';
import { Member } from './useMember';

const GET_MEMBERS = gql`
  {
    query {
      members {
        nodes {
          id
          account {
            id
            address
            additional
            display
            legal
            web
            riot
            email
            pgpFingerprint
            image
            twitter
          }
          locked
          type
          status
          joinTime
          elevatedTime
          joinMotionHash
          elevatedMotionHash
        }
      }
    }
  }
`;

interface QueryList<T> {
  query: {
    members: {
      nodes: T[];
    };
  };
}

export function useMembers() {
  const { data, loading, error } = useQuery<QueryList<Member>>(GET_MEMBERS);

  console.log('data', data, data?.query.members.nodes || []);
  return { data: data?.query.members.nodes || [], loading, error };
}