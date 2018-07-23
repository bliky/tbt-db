export default [
  {
    id: 21,
    name: 'UV',
    data: []
  },
  {
    name: '线索',
    children: [
      {
        id: 7,
        name: '发起次数',
        data: []
      },
      {
        id: 22, // 还未提供
        name: '发起/UV',
        vtype: 1,
        data: []
      },
      {
        id: 8,
        name: '新增',
        data: []
      },
      {
        id: 9,
        name: '新增/发起',
        vtype: 1,
        data: []
      }
    ]
  },
  {
    name: '可售',
    children: [
      {
        id: 10,
        name: '可售信息数',
        data: []
      },
      {
        id: 11,
        name: '可售/新增',
        vtype: 1,
        data: []
      }
    ]
  },
  {
    name: '分派',
    children: [
      {
        id: 12,
        name: '分派信息数',
        data: []
      },
      {
        id: 13,
        name: '分派/可售',
        vtype: 1,
        data: []
      }
    ]
  },
  {
    name: '扣款',
    children: [
      {
        id: 14,
        name: '扣款信息数',
        data: []
      },
      {
        id: 20,
        name: '扣款/分派',
        vtype: 1,
        data: []
      },
      {
        id: 15,
        name: '金额(元)',
        vtype: 2,
        data: []
      }
    ]
  },
  {
    name: '签约',
    children: [
      {
        id: 16,
        name: '订单数',
        data: []
      },
      {
        id: 17,
        name: '订单金额(元)',
        vtype: 2,
        data: []
      },
      {
        id: 18,
        name: '签约/扣款',
        vtype: 1,
        data: []
      },
      {
        id: 19,
        name: '客单价(元)',
        vtype: 2,
        data: []
      }
    ]
  }
]
