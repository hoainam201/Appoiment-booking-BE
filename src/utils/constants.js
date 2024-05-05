const specialities = [
    {
        id: 0,
        name: "Đa khoa",
        key: "General",
    },
    {
        id: 1,
        name: "Tiêu hóa",
        key: "Gastroenterology",
    },
    {
        id: 2,
        name: "Tim mạch",
        key: "Cardiology",
    },
    {
        id: 3,
        name: "Chỉnh hình",
        key: "Orthopedics",
    },
    {
        id: 4,
        name: "Tai-mũi-họng",
        key: "ENT",
    },
    {
        id: 5,
        name: "Thần kinh",
        key: "Neurology",
    },
    {
        id: 6,
        name: "Da liễu",
        key: "Dermatology",
    },
    {
        id: 7,
        name: "Nam học",
        key: "Andrology",
    },
    {
        id: 8,
        name: "Tiết niệu",
        key: "Urology",
    },
    {
        id: 9,
        name: "Sản Phụ khoa",
        key: "Gynecology",
    },
    {
        id: 10,
        name: "Hô hấp",
        key: "Pulmonology",
    },
    {
        id: 11,
        name: "Răng-hàm-mặt",
        key: "Dentomaxillofacial",
    },
    {
        id: 12,
        name: "Xương khớp",
        key: "Rheumatology",
    },
    {
        id: 13,
        name: "Khoa nhi",
        key: "Pediatrics",
    },
    {
        id: 14,
        name: "Khoa ngoại",
        key: "Oncology",
    },
    {
        id: 15,
        name: "Nhãn khoa",
        key: "Opthalmology",
    }
];

const staffRole = {
    DOCTOR: 0,
    MANAGER: 1,
};


const bookingStatus = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    COMPLETED: 3,
    CANCELLED: 4
};

const newsStatus = {
    SHOW: true,
    HIDE: false
}

const serviceType = {
    DOCTOR: 0,
    PACKAGE: 1,
};

const notificationStatus = {
    UNREAD: 0,
    READ: 1,
    DELETED: 2,
};



module.exports = {
    specialities,
    staffRole,
    bookingStatus,
    serviceType,
    notificationStatus,
    newsStatus,
}