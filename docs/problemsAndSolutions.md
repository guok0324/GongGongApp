# 问题答疑

## react-native-gesture-handler

ScrollView和RNGH的pan等手势会冲突。在该项目的HomePage的AgendaComponent中，需要写一个类似于QQ可以左右滑动呼出
功能模块，同时又可以垂直滚动的列表。  
起初准备使用Pan手势手搓一个类似的效果，但是尝试后无果，触发pan手势后，无论是在onBegin还是在onUpdate回调函数中都无法
触发滚动。之后发现RNGH官方提供了一个叫Swipeable的组件，该组件可以在提供水平滚动的情况下，又能防止其屏蔽外层ScrollView
的垂直滚动(触发垂直滚动则不触发水平，同理水平滚动)，踩雷。

##   