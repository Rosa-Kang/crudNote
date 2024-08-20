export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");

    let initials = words.slice(0, 2).map((word) => word[0]).join("");

    return initials.toUpperCase();
}