// tests/test-utils.ts (o tests/utils/path-helpers.ts)
import * as path from 'path';

export function getCsvPath(fileName: string): string {
    // La lógica de ruta ABSOLUTA se define UNA VEZ aquí.
    return path.join(process.cwd(), 'ejemplos-csv', fileName);
}