import { RegexProtocol } from './regex.protocol';

export class RemoveSpacesRegex extends RegexProtocol {
  execute(str: string): string {
    return str.replace(/\s+/g, '');
  }
}
