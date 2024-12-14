import moment from "moment";

const fileFormat = (url="") =>{
    const fileExt = url.split('.').pop();

    if(fileExt === "mp4" || fileExt === "ogg" || fileExt === "webm"){
        return "video";
    }

    if(fileExt === "mp3" || fileExt === "wav"){
        return "audio";
    }

    if(fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif"){
        return "image";
    }

    return "file";
}


const transformImage=(url="",width=100) =>url;

const getLast7Days = ()=>{
    const currentDate = moment();
    const last7Days = [];

    for(let i=0;i<7;i++){
        last7Days.unshift(currentDate.format("MMM D"));
        currentDate.subtract(1,"days");
    }

    return last7Days;
};
export {fileFormat,transformImage,getLast7Days}