# 数据看板
基于开源项目[开源中国微信版 vue+vux的2.x版本](https://github.com/iuoon/oscwx_2.0)

## 快速开发

```
# 安装npm依赖
npm install

# 启动开发
npm run dev

# 启动转发层服务
https://github.com/iuoon/TWServer 

# 修改utils目录api.js的host_addr为自己的TWServer服务地址
```

## 页面总览

sn | path | module | status | description
-- | -- | -- | -- | --
0 | bdc-prd-dbd/board | board/Board | ok | 首页
1 | bdc-prd-dbd/dataBoard | board/DataBoard | ok | 指标总览与指标趋势
2 | bdc-prd-dbd/editInd | board/EditInd | ok | 编辑指标
3 | bdc-prd-dbd/myinds | my/MyInds | ok | 名词释义，指标释义
4 | bdc-prd-dbd/indesc | my/Indesc | ok | 总况(GMV，装企收入)，流量（新访客数，PV，APP启动次数）
5 | bdc-prd-dbd/nounDesc | my/NounDesc | ok | 日同比，日环比
6 | bdc-prd-dbd/apply | apply/Apply | ok | 指标申请
6 | bdc-prd-dbd/selInd | apply/selInd | error | 空白
7 | bdc-prd-dbd/selDim | apply/selDim | ok | 外呼转化率
8 | bdc-prd-dbd/apply/ind | apply/Ind | empty | 空白
9 | bdc-prd-dbd/dashboard | dashboard/index | dev | 已开发，待上线
10 | bdc-prd-dbd/roi | roi/index | dev | 开发中

## author
name: ken.li

email: ken.li@corp.to8to.com
