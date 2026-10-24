# መሠረተ አንድነት በጎ አድራጎት ማህበር — Website

ይህ የNext.js ፕሮጀክት የአማርኛ ድረ-ገጽ፣ የአባልነት ቅጽ፣ የኢሜይል OTP ማረጋገጫ፣ የPostgreSQL መረጃ ማስቀመጫ እና ለአስተዳዳሪ ኢሜይል ማሳወቂያ ያካትታል።

## አስፈላጊ የደህንነት ማስታወሻ
- API Key በChatGPT፣ በfrontend ኮድ ወይም GitHub ላይ አያጋሩ።
- `.env` ፋይል ወደ GitHub አይጫኑ። `.gitignore` ውስጥ ተጨምሯል።
- ይህ ፕሮጀክት ለምዝገባ የመረጃ ማስቀመጫ (PostgreSQL) ይፈልጋል። ያለ ዳታቤዝ የምዝገባ አገልግሎቱ አይሰራም።
- `EMAIL_FROM` በResend ውስጥ የተፈቀደ/የተረጋገጠ የላኪ አድራሻ መሆን አለበት። `onboarding@resend.dev` በResend የሙከራ ደረጃ ሊገደብ ይችላል፤ ለምርት አጠቃቀም የራስዎን ዶሜይን ያረጋግጡ።
- የውስጥ ሕግና ደንብ ክፍሉ ረቂቅ ነው፤ በመስራች አባላትና በሚመለከተው ሕጋዊ አሠራር መሠረት ይገምገሙት።

## ለማስኬድ
1. Node.js 20+ እና Git ያስፈልጋሉ።
2. በፕሮጀክቱ ፎልደር ውስጥ ተርሚናል ከፍተው `npm install` ያስኪዱ።
3. `.env.example` ቅዳ አድርገው `.env` ብለው ይሰይሙ።
4. `DATABASE_URL` በPostgreSQL አቅራቢዎ የሰጠውን የግንኙነት አድራሻ ያስገቡ።
5. `RESEND_API_KEY` ውስጥ የራስዎን ቁልፍ ያስገቡ። በ`EMAIL_FROM` የResend የተፈቀደ የላኪ አድራሻ ያስገቡ።
6. የዳታቤዝ ሰንጠረዦችን ለመፍጠር `npx prisma db push` ያስኪዱ።
7. በአካባቢው ለመሞከር `npm run dev` ያስኪዱ።
8. ለምርት ማስተናገጃ ፕሮጀክቱን ወደ GitHub ከጫኑ በኋላ Vercel ጋር ያገናኙ፤ `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL` እንደ Environment Variables ያስገቡ።

## የሚፈለጉ የEnvironment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `RESEND_API_KEY`: በResend የፈጠሩት ሚስጥራዊ API key
- `EMAIL_FROM`: በResend የተረጋገጠ የላኪ አድራሻ
- `ADMIN_EMAIL`: የአስተዳዳሪ ኢሜይል፣ ነባሪ `mesereteandinetdilla@gmail.com`
- `OTP_PEPPER`: አማራጭ፤ ለproduction ረጅም እና የማይገመት የሚስጥር ሕብረቁምፊ ያድርጉት። በሁሉም አካባቢዎች አንድ ይሁን።

## የደህንነት ነጥቦች
- OTP 6 አሃዝ ነው፣ 10 ደቂቃ ይቆያል፣ እና ከ5 የተሳሳቱ ሙከራዎች በኋላ ይሰረዛል።
- ኮዱ በዳታቤዝ hash ተደርጎ ይቀመጣል።
- ለምርት ከመጠቀም በፊት የAPI rate limiting፣ privacy notice፣ database backup፣ monitoring እና የአባላት መረጃ የማስተዳደር ፖሊሲ ያክሉ።
