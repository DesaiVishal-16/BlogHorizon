export default function getReadMin(content:string){
        let readPerMin = 200;
        let  words = content.trim().split(/\s+/).length;
        let time =  Math.ceil(words/readPerMin);
        return time;
}