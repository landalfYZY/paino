var paino = [
  {
    label:'推广管理',
    icon:'',
    children:[
      {
        label: '推荐',
        path: '/groom'
      },
      {
        label: '热门',
        path: '/hot'
      },
    ]
  },
  {
    label:'图库',
    icon:'',
    children:[
      {
        label: '图库',
        path: '/uiConsoleGallery'
      },
    ]
  },
  {
    label:'商品管理',
    icon:'',
    children:[
      {
        label: '商品列表',
        path: '/goodsList'
      },
      {
        label: '新增商品',
        path: '/goodsAdd'
      },
    ]
  }
]

module.exports = {
  paino: paino,
}
