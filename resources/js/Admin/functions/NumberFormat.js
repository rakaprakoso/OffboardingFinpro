const NumberFormat = (number, append = '', prepend = '') => {
    var number = parseFloat(number);
    var num_parts = number.toFixed(0).toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var numberFormatted = num_parts.join(".");

    numberFormatted = append + ' ' + numberFormatted + ' ' + prepend;
    // const numberFormatted = append + ' ' + number.toLocaleString("id-ID") + ' ' + prepend;
    return (
        numberFormatted
    );
}

const PercentFormat = (Numerator, Denominator, limit=2) => {
    const percentFormatted = ((parseInt(Denominator)-parseInt(Numerator)) / parseInt(Denominator) * 100).toFixed(limit);
    return (
        percentFormatted + "%"
    )
}

export {NumberFormat, PercentFormat};
