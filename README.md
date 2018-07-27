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

## 入口页面

sn | path | module | status | author | description
-- | -- | -- | -- | -- | --
0 | bdc-prd-dbd/board | board/Board | ok | ken.li | 首页
1 | bdc-prd-dbd/dashboard | dashboard/index | dev | ken.li | 转化漏斗
2 | bdc-prd-dbd/roi | roi/index | dev | ken.li | ROI分析
3 | bdc-prd-dbd/dataBoard | board/DataBoard | ok | richard.luo | 指标看板
4 | bdc-prd-dbd/apply | apply/Apply | ok | richard.luo | 指标申请
5 | bdc-prd-dbd/myinds | my/MyInds | ok | richard.luo | 指标释义

## 子页面

sn | path | module | status | author | description
-- | -- | -- | -- | -- | --
1 | bdc-prd-dbd/editInd | board/EditInd | ok | richard.luo | 编辑指标
2 | bdc-prd-dbd/indesc | my/Indesc | ok | richard.luo | 指标释义
3 | bdc-prd-dbd/nounDesc | my/NounDesc | ok | richard.luo | 名词释义
4 | bdc-prd-dbd/selInd | apply/selInd | error | richard.luo | 空白
5 | bdc-prd-dbd/selDim | apply/selDim | ok | richard.luo | 外呼转化率
6 | bdc-prd-dbd/apply/ind | apply/Ind | empty | richard.luo | 空白


## author
name: ken.li

email: ken.li@corp.to8to.com
