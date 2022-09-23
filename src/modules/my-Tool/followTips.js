export default function FansOrFoll(flag, loginUserId, currentUserId, route) {
  if (loginUserId == currentUserId) {
    if (route.name === 'Fans') {
      return flag === 1 ? '你的粉丝' : '你还没有粉丝哦';
    } else {
      return flag === 1 ? '你的关注' : '你还没有关注哦';
    }
  } else {
    if (route.name === 'Fans') {
      return flag === 1 ? 'Ta的粉丝' : 'Ta还没有粉丝哦';
    } else {
      return flag === 1 ? 'Ta的关注' : 'Ta还没有关注哦';
    }
  }
}
