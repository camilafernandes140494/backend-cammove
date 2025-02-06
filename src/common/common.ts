export function normalizeString(str: string): string {
  return str
    .toLowerCase() // Converte para minúsculas
    .normalize('NFD') // Decompõe caracteres com acento
    .replace(/[\u0300-\u036f]/g, ''); // Remove os acentos
}
