echo "🔍 스타일 파일 내 미사용 export 검사 중..."
pnpm find-deadStyleCode | grep -E 'styles.ts' > .ts-prune-style.txt

if [ -s .ts-prune-style.txt ]; then
  cat .ts-prune-style.txt
  echo ""
  echo "🚫 ts-prune: 스타일 코드에 사용되지 않은 export가 있습니다. 커밋을 중단합니다."
  exit 1
fi

rm -f .ts-prune-style.txt