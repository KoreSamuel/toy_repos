export default function myPlugin() {
  return {
    name: 'my-plugin',
    resolveId(source) {
      if (source === 'virtual-module') {
        return source;
      }
      return null;
    },
    load(id) {
      if (id === 'virtual-module') {
        return 'export default "This is virtual code!"';
      }
      return null;
    }
  };
}
