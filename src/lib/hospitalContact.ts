/** Keep separate lines and extensions intact when producing dialable links. */
export function getHospitalPhoneLinks(value = '') {
  return value.split(/\s*[/、,，；]\s*/).flatMap((label) => {
    const [number, extension] = label.trim().split(/\s*(?:#|分機|ext\.?)[\s:]*/i);
    const digits = number.replace(/[^+\d]/g, '');
    if (!/^\+?\d{8,15}$/.test(digits)) return [];
    const ext = extension?.replace(/\D/g, '');
    return [{ label: label.trim(), href: `tel:${digits}${ext ? `;ext=${ext}` : ''}` }];
  });
}
