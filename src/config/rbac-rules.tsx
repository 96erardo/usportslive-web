const rules: Rules = {
  Visitor: {
    static: [
      'dashboard-page:visit'
    ],
  },
  Administrator: {
    static: [
      'admin-page:visit',
      'dashboard-page:visit'
    ],
    dynamic: {
      
    }
  }
};

export type Rules = {
  [key: string]: {
    static?: Array<string>,
    dynamic?: {
      [key: string]: (data: object) => boolean,
    }
  }
}

export default rules;