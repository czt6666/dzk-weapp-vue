import { imgUrl } from "./index";

export function transHtml(htmlCode: string) {
    // 获取 img 元素的src，使用 imgUrl 函数处理
    const imgRegex = /<img.*?src="(.*?)".*?>/g;
    return htmlCode.replace(imgRegex, (match, src) => {
        return `<img src="${imgUrl(src)}" style="width: 100%;" alt="图片" />`;
    });
}
