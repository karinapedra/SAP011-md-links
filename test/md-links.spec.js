const mdLinks = require('../src/index');
const { spawnSync } = require('child_process');
const mock = require('mock-fs');


describe('runAllTests', () => {
  beforeAll(() => {
    mock({
      'C:/path/to/nonexistent-file.md': 'Conteúdo do arquivo válido',
    });
  });
  describe('mdLinks', () => {
    it('should extract links from markdown content', () => {
      const markdownContent = `# Title 1
[Link 1](http://example.com)
# Title 2
[Link 2](http://example2.com)
      `;
      const expectedLinks = [
        { text: 'Link 1', href: 'http://example.com', title: 'Title 1', file: 'someFile.md' },
        { text: 'Link 2', href: 'http://example2.com', title: 'Title 2', file: 'someFile.md' },
      ];
      const result = mdLinks.extractLinks(markdownContent, 'someFile.md');
      expect(result).toEqual(expectedLinks);
    });

    it('should return an empty array if no links are found in the Markdown content', () => {
      const markdownContent = `This is a Markdown file without any links.`;
      const result = mdLinks.extractLinks(markdownContent, 'someFile.md');
      expect(result).toEqual([]);
    });
  });

  describe('mdLinks › should validate links', () => {
    // Teste válido
    it('should validate links', () => {
      const links = [
        { text: 'Link 1', href: 'http://example.com', title: 'Title 1', file: 'someFile.md' },
        { text: 'Link 2', href: 'http://example2.com', title: 'Title 2', file: 'someFile.md' },
      ];
      const promises = links.map((link) => mdLinks.validateLink(link));
      return Promise.all(promises).then((results) => {
        expect(results).toEqual(links);
      });
    });

    // Teste de conteúdo Markdown inválido
    it('should handle invalid Markdown content', () => {
      const invalidMarkdownContent = 'invalid markdown content';
      try {
        mdLinks.extractLinks(invalidMarkdownContent, 'someFile.md');
      } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
   // No arquivo test/md-links.spec.js
   it('should handle invalid options', () => {
    const invalidPath = 'C:/path/to/nonexistent-file.md';
    return mdLinks.mdLinks(invalidPath, 'invalidOptions').catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Arquivo não encontrado');
    });
  });
});
});

describe('CLI', () => {
  test('should analyze links in a Markdown file', () => {
    const result = spawnSync('node', ['src/cli.js', 'path/to/markdown-file.md'], { encoding: 'utf-8' });
    // Adicione as asserções necessárias para verificar a saída esperada do seu CLI para este caso
    expect(result.status).toBe(0);
  });

  test('should analyze links in a Markdown file with validation', () => {
    const result = spawnSync('node', ['src/cli.js', 'path/to/markdown-file.md', '--validate'], { encoding: 'utf-8' });
    // Adicione as asserções necessárias para verificar a saída esperada do seu CLI para este caso
    expect(result.status).toBe(0);
  });

  test('should analyze links in a Markdown file with stats', () => {
    const result = spawnSync('node', ['src/cli.js', 'path/to/markdown-file.md', '--stats'], { encoding: 'utf-8' });
    // Adicione as asserções necessárias para verificar a saída esperada do seu CLI para este caso
    expect(result.status).toBe(0);
  });
  afterAll(() => {
    mock.restore();
  });
});
