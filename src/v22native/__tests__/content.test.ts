import { buildRequestBody, emptyForm, isFormValid, links, serviceOptions, services } from '../content';

describe('v22 content', () => {
  it('requires name, phone and service — same rule as his submitReq()', () => {
    expect(isFormValid(emptyForm)).toBe(false);
    expect(isFormValid({ ...emptyForm, name: 'A', phone: '1' })).toBe(false);
    expect(isFormValid({ ...emptyForm, name: 'A', phone: '1', service: 'Protective Detail' })).toBe(true);
    expect(isFormValid({ ...emptyForm, name: '  ', phone: '1', service: 'Protective Detail' })).toBe(false);
  });

  it('builds the same email body, skipping empty optional fields', () => {
    expect(buildRequestBody({ ...emptyForm, service: 'Black Car Service', name: ' Ann ', phone: '555', date: '2026-12-01', details: 'Two SUVs' })).toBe(
      'Service: Black Car Service\n\nName: Ann\nEvent Date: 2026-12-01\nPhone: 555\n\nDetails:\nTwo SUVs',
    );
  });

  it('keeps his verified contact links', () => {
    expect(links).toEqual({ tel: 'tel:+15513014430', facetime: 'facetime:innovationbusiness@icloud.com', whatsapp: 'https://wa.me/18623325004' });
  });

  it('offers every listed service in the request picker', () => {
    for (const s of services) expect(serviceOptions).toContain(s.name);
  });
});
