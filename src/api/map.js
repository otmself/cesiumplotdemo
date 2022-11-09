import request from "@/utils/request";

export function save(lon, lat) {
    let data = {
        "longitude": lon,
        "latitude": lat
    }
    return request({
        url: `/regin/getDistricts`,
        method: 'post',
        data
    })
}