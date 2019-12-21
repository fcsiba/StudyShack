
class ArrayUtils {

    static shared = new ArrayUtils()

    getAtring() {


        
    }

    arraysEqual(array1, array2) {
        for (var i = 0; i < array1.length; i++) {
            if (array2.includes(array1[i])){
                return true
            }
        }
        return false;
    }


}
let arrayUtils = ArrayUtils.shared;
export { arrayUtils }

