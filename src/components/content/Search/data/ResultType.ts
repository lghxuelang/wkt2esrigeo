import GUID from '@/utils/data/GUID';

class SearchResult {
  uid: string;
  previous?: SearchResult | null;
  data: object;

  constructor({ uid, data, previous = null }) {
    const guid = new GUID();
    this.uid = guid.generate();
    this.previous = previous;
    this.data = data;
  }
}

export default SearchResult;
