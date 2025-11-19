export function generateBarcodeFromName(productName) {
    const actualDate = new Date();
    const completeProductName = `${actualDate.toISOString()} ${productName}`;
    let hash = 0;
    for (let i = 0; i < completeProductName.length; i++) {
        hash = ((hash << 5) - hash) + completeProductName.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString();
}