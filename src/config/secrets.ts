const secrets=new Set<string>();
export function registerSecret(value?:string){if(value) secrets.add(value)}
export function sanitize(value:unknown):string { let text=value instanceof Error?value.message:String(value); for(const secret of secrets) text=text.split(secret).join("***"); return text.replace(/Bearer\s+\S+/gi,"Bearer ***"); }
