import fetcher from './fetcher';

export interface TestPatParams {
  pat: string;
}

export type TestPatData = void;

export default async function testPat({
  pat,
}: TestPatParams): Promise<TestPatData> {
  return fetcher.get('token', {
    headers: {
      Authorization: `Bearer ${pat}`,
    },
  });
}
