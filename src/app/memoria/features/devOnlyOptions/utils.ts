export type DevOptionsObject = {
  showClosedContent: boolean;
};
const devOptionsConfig: { encoding: BufferEncoding } = {
  encoding: 'base64url',
};
export const DevOptionsFormat = {
  stringify(devOptionsObject: DevOptionsObject): string {
    const jsonString = JSON.stringify(devOptionsObject);
    const encoded = Buffer.from(jsonString).toString(devOptionsConfig.encoding);
    return encoded;
  },
  parse(devOptions: string): DevOptionsObject {
    const decoded = Buffer.from(devOptions, devOptionsConfig.encoding).toString('ascii');
    const jsonObject = JSON.parse(decoded);
    return jsonObject;
  },
};
