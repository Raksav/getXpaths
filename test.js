function getFirstNonEmptyElementAfterSplittingOnNumbers(str) {
    const parts = str.split(/\d+/);
    for(let i = 0; i < parts.length; i++) {
        if(parts[i].trim() !== '') {
            return parts[i];
        }
    }
    return '';
}

let str = "3453dafks-@5dakfjak-4545-dfgsdf";
console.log(getFirstNonEmptyElementAfterSplittingOnNumbers(str)); // Outputs: "dafkdakfjak-"
