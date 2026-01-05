const { execSync } = require('child_process');

try {
  const tags = execSync('git tag', { encoding: 'utf8' })
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean);
  if (tags.length === 0) {
    console.log('本地沒有任何 tag');
    process.exit(0);
  }
  for (const tag of tags) {
    execSync(`git tag -d "${tag}"`, { stdio: 'inherit' });
  }
  console.log('本地所有 git tag 已清除完畢');
} catch (e) {
  console.error('清除本地 tag 發生錯誤:', e.message);
  process.exit(1);
}
