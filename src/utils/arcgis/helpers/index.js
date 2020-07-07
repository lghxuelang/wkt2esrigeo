
/**
 * 数组去重
 * @author  lee  
 * @param {Array}   数组
 * @returns {Array}   数组
 */
const unique = (arr) => {
    return Array.from(new Set(arr))
}
const mathUtils = {
    unique
};

export default mathUtils;
