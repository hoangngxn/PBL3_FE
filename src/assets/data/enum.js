let enumData = null;

export const fetchEnumData = async () => {
    if (!enumData) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/enum/`);
            if (response.ok) {
                enumData = await response.json();
                console.log("Dữ liệu lấy thành công", enumData);
            } else {
                console.error("Lỗi khi lấy dữ liệu enum");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
        }
    }
    return enumData;
};

export const getEnumData = () => enumData;

console.log(enumData);
