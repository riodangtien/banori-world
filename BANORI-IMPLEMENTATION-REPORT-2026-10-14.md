> **Bản trước:** Báo cáo này mô tả cơ chế bàn học V2 đã được thay thế theo yêu cầu tiếp theo. Bản hiện tại là khám phá/chụp động vật; xem README và qa/wildlife cho bằng chứng mới.

# BANORI WORLD V2 — Báo cáo triển khai

Ngày: 14/10/2026. Phạm vi: bản local trong dự án hiện tại, **không push GitHub, không deploy**.

## A. Thay đổi theo phase

### Phase 1 — UX và khả năng đọc

- Tăng chữ/nút quan trọng của HUD, câu hỏi, gợi ý và kết quả. Vùng chạm chính tối thiểu 44×44 CSS px trong kiểm tra cảm ứng.
- Minimap có thể thu gọn/mở lại trên desktop; màn hình nhỏ dùng nút bản đồ gọn và bản đồ lớn. Thêm nhãn khu vực và cầu theo dữ liệu map thật.
- Giữ World là khung game cố định dưới navbar. Chặn việc cập nhật mode của iframe ẩn làm đổi bố cục Home/Brand. Không phục hồi chế độ cuộn/zoom bằng bánh xe.
- Hướng dẫn trực tiếp theo di chuyển, xoay camera, ngắm, chụp, giải toán và kết quả. Có bỏ qua, mở lại từ Pause và lưu bước đã đạt. Hướng dẫn không khóa thao tác chơi nếu phát hiện bước chưa đạt.
- Session được memo hóa; cập nhật UI/âm thanh không còn tạo lại listener và xóa phím/cần điều khiển đang giữ. Listener cập nhật theo phase/pause để vẫn khóa di chuyển đúng khi giải toán.

### Phase 2 — Thế giới 3D

- Sky sáng hơn, tách tone mapping của sky và tranh mascot; vật liệu đất/lá chuyển sang xanh tươi. Giữ ánh sáng tự nhiên, bóng mềm, không thêm bloom.
- Dọn vùng spawn và hai glade học tập; giữ khoảng trống cạnh đường, giảm cây sát tuyến/camera. Cỏ nhọn được thay bằng tufts thấp; đường mòn rộng hơn và bỏ mảnh path nhỏ.
- Ba khu có vai trò: **Number Camp**, **Shape Garden**, **Measure Trail**. Biển chỉ dẫn, minimap và vật thể tương ứng được nối vào cùng cấu trúc nhiệm vụ.
- Vật thể học tập đặt cạnh tuyến đi, kiểm tra footprint 1,2 m trên nền khô, tránh collider/công trình và ngoài đảo. Các kiosk đứng ổn định, không quay/bob như vật phẩm cũ; bảng/diện hiển thị quay về góc nhìn để đọc được.
- Clearance của camera có tính cả tán cây, không chỉ thân cây. Giữ movement, jump và bề mặt cầu/terrain dùng chung.
- Không vẽ lại mascot, không render nhân vật người như BANORI. Dùng bản raster từ **2home.svg nguyên gốc** làm billboard tạm. Giữ file model CC0 cũ trên đĩa. Đây không phải model BANORI 3D có rig/animation.

### Phase 3 — Chụp và phản hồi

- Phân biệt TOO_FAR, NOT_CENTERED, OCCLUDED, WRONG_TARGET và SUCCESS. Thông báo tiếng Việt, icon và hành động tiếp theo; thành công mở notebook có ảnh thực.
- Chụp dùng kết quả raycast tại thời điểm lấy ảnh; chờ tạo ảnh trước khi mở câu hỏi, tránh kiểm tra một camera đã di chuyển sang khung hình khác.
- Thu nhỏ máy ảnh cầm tay để bớt che cảnh. Giữ hai góc nhìn, phím F, joystick và jump; mở hỗ trợ portrait thay vì bắt buộc xoay thiết bị.
- Trả lời sai/skip chỉ đổi vị trí gần tối đa hai lần trong một nhiệm vụ. Sau đó câu hỏi ở lại, có gợi ý và phản hồi hiện bên trong dialog. Sau giới hạn, nút hỗ trợ không yêu cầu đi tìm lại nữa.

### Phase 4 — Toán gắn với cảnh

- **75 câu mẫu, 15 câu riêng cho mỗi lớp 1–5**, mỗi lớp 5 số học + 5 hình học + 5 đo lường. Có Easy/Medium/Hard, kỹ năng, đáp án, gợi ý, lời giải và scene metadata.
- `SceneSpec` dùng chung cho câu hỏi, hình 3D và hình giải thích: số quả và số nhóm chuối, cạnh/hình/dimensions, hai số đo A/B.
- Hình có kích thước thể hiện tỷ lệ theo dữ liệu; biển ghi số đo. Mô hình đo lường là mô hình có tỷ lệ, **đọc số đo ghi trên bảng**, không suy ra cm/km từ kích thước phối cảnh hoặc khoảng cách controller.
- Giữ đáp án đúng theo nội dung, chỉ trộn thứ tự hiển thị. Kiểm thử độc lập tính kết quả, đơn vị, tính duy nhất và nhóm vật thể; thống nhất dấu phẩy thập phân trên biển/đáp án.
- Ngân hàng và bản đọc cho giáo viên: [75 câu](qa/v2/question-bank.md), [JSON](qa/v2/question-bank.json). Đây là bộ mẫu theo ba chủ đề, không bao phủ toàn bộ chương trình mỗi lớp.

### Phase 5 — Kết quả và lưu tiến độ

- Kết quả có câu hỏi, đáp án đúng, hình giải thích, kỹ năng, XP, tiến độ ba khu và nút tiếp tục.
- Lưu phiên gần nhất, bước hướng dẫn và vị trí người chơi an toàn theo run ID. Khôi phục giữ vị trí hợp lệ, camera hướng tới mục tiêu; save lỗi/khác run không được dùng làm vị trí người chơi.
- Lưu lịch sử tối đa **20 phiên** trên cùng thiết bị, cập nhật một run thay vì ghi trùng mỗi lần render. Launcher cho xem các phiên gần đây/kỹ năng đã luyện.
- Không thêm tài khoản hoặc đồng bộ cloud. Ảnh Blob chỉ thuộc phiên đang mở; ảnh chụp vẫn có link tải trong Pause.

### Phase 6 — Website

- Home CTA nói rõ demo toán 3D; subtitle dễ đọc hơn, hero dùng artwork gốc với kích thước hợp lý.
- About giải thích nhóm lớp, thao tác chơi và cách học từ vật thể.
- Characters có trang riêng với tranh chính thức, tính cách/vai trò; không còn dẫn tới cùng overview của Brand.
- Brand tăng khả năng đọc, cân lại hero/caption và giữ khoảng cách với chân mascot. Logo/màu/asset gốc không bị thay thế.
- “Watch trailer” đổi thành “View gameplay demo” và dẫn tới game thật, không tạo video giả.
- Giữ **PLAY • EXPLORE • PROTECT**. Website dùng tiếng Anh như yêu cầu trước; hướng dẫn/câu hỏi/phản hồi học tập tiếng Việt theo yêu cầu V2.
- Thời tiết, mùa, motion và tải ảnh được giữ trong Pause. Không thêm nút âm thanh/Quality; âm nền giảm khi mở câu hỏi.

### Phase 7 — Kiểm tra và hoàn thiện

- Build/typecheck, kiểm thử toán/physics/storage, kiểm tra browser runtime, ảnh desktop/tablet/mobile và kiểm tra ngân sách renderer. Chi tiết ở phần C.
- Có snapshot trước thay đổi tại `work/v2-before`, không reset Git hoặc ghi đè bằng checkout cũ. Thay đổi chưa commit trước lượt này được giữ trong bản làm việc/backup.

## B. File chính

| File | Vai trò |
|---|---|
| world-src/src/game/questions.ts | Grade/topic/difficulty, 75 câu, phép tính, scene metadata và định dạng số |
| world-src/src/game/GameContext.tsx | State machine, 5 trạng thái chụp, giới hạn retry, XP, save và lịch sử phiên |
| world-src/src/game/LearningObject.tsx | Hình 3D giỏ chuối/biển hình/cầu mô hình, dùng số liệu thật của câu hỏi |
| world-src/src/game/LearningVisual.tsx | Hình giải thích SVG dùng chung scene data |
| world-src/src/game/LearningStations.tsx, QuestItem.tsx, locations.ts | Khu học tập, mục tiêu hiện tại, vị trí an toàn cạnh tuyến |
| world-src/src/game/GameHUD.tsx, game.css, FieldMap.tsx, Icons.tsx | Launcher/HUD/notebook/kết quả, responsive, bản đồ và icon |
| world-src/src/game/Onboarding.tsx | Hướng dẫn theo hành động thực, skip/reopen |
| world-src/src/game/ExpeditionWorld.tsx | Sky và biển chỉ dẫn |
| world-src/src/App.tsx | Session ổn định, asset readiness, climate slot, audio ducking |
| world-src/src/player/controller.ts, PlayHUD.tsx, PhotoCamera.tsx | Điều khiển/phím/cảm ứng, vị trí lưu an toàn, transaction chụp |
| world-src/src/player/Character.tsx | Billboard từ asset chính thức, không thay mascot bằng người |
| world-src/src/camera/CameraRig.tsx | Camera/crown clearance/checkpoint và chuyển góc ổn định |
| world-src/src/world/Terrain.tsx, layout.ts, Paths.tsx; vegetation/Vegetation.tsx; environment/WorldLighting.tsx | Palette, clearing, tuyến đi, thực vật và ánh sáng |
| world-src/src/world/World.tsx | Gắn các hệ thống mới vào cảnh hiện có |
| index.html, script.js, style.css | Home/About/Characters/Brand/navigation/CTA và khung World |
| world-src/index.html, forest/index.html, forest/assets | Metadata/font URL và output production build |
| assets/banori-official-billboard.png | Raster từ SVG chính thức, giữ tỷ lệ và màu; không phải tranh mới |
| game/game.test.ts, player/controller.test.ts, world/quality.test.ts | Regression tests cho dữ liệu, retry/save/pose/camera và môi trường |
| README.md, qa/v2 | Cách chạy, dữ liệu kiểm chứng và ảnh |

Danh sách so với snapshot đầu lượt: [changed-files.json](qa/v2/changed-files.json). Không xóa logo, SVG mascot hoặc asset gốc.

## C. Kết quả kiểm thử

| Mục | Kết quả | Bằng chứng / phạm vi |
|---|---|---|
| Build | **PASS** | `npm --prefix world-src run build` |
| Typecheck | **PASS** | `tsc -b` trong build |
| Unit/data/physics/storage | **PASS** | 41 tests, 5 suites; `qa/v2/unit-tests.json` |
| Gameplay | **PASS** | Browser: move/turn onboarding, skip/reopen, ảnh thực, câu hỏi/gợi ý/XP/kỹ năng, chuyển khu, lưu/khôi phục; retries/5 capture statuses có unit coverage |
| Responsive | **PASS** | 1920×1080, 1366×768, 1024×768, 844×390, 667×375, 390×844; landscape/portrait touch controls |
| Visual | **PASS trong phạm vi ảnh kiểm tra** | Ảnh `qa/v2/`, so với `qa/demo/refinement/audit-*`; không phải thử nghiệm với trẻ thật |
| Performance máy GPU thật | **NOT RUN** | Môi trường browser dùng SwiftShader; không dùng FPS software làm lời hứa FPS máy trung bình |
| Ngân sách renderer | **PASS** | Snapshot: 108 draw calls, 154.455 triangles, 144 geometries, 44 textures; dưới ngưỡng 160 draw calls / 180.000 triangles. Chi tiết trong `render-budget.json` |

Console/page errors của browser run chính: không có lỗi được ghi nhận. Vùng chạm được đo trong `touch-targets.json`. Browser phục vụ đúng file local qua Playwright route vì Chromium HTTP bị sandbox chặn; production không có mã route này.

Build vẫn có cảnh báo chunk Three.js lớn và đường dẫn một số asset CSS giữ nguyên để resolve runtime; browser đã tải được các asset trong kiểm tra. Không thêm dependency nặng.

Các ảnh fixture Grade 5 dùng checkpoint được thiết lập ở glade để kiểm tra riêng rendering/capture/feedback. Chúng **không chứng minh đã đi bộ toàn tuyến** từ Camp tới Garden. Run chính hoàn thành một nhiệm vụ thực từ thao tác tới XP; unit tests kiểm tra hoàn tất cả ba khu và giới hạn retry.

## D. Giới hạn còn lại

1. Chưa có model BANORI 3D có rig/animation đúng nhận diện. Billboard di chuyển theo controller nhưng không có animation đi/nhảy riêng hay khối 3D thật. Không gọi đây là nhân vật 3D hoàn chỉnh.
2. FPS, nhiệt/độ ổn định trên GPU/máy cấu hình trung bình và thiết bị cảm ứng vật lý chưa xác minh; mới có renderer budget và emulation.
3. Bộ 75 câu đã kiểm tra số học/đáp án/đơn vị/scene contract; cần phát triển thêm chủ đề và giáo viên duyệt nội dung sư phạm nếu dùng như chương trình học đầy đủ.
4. Save/lịch sử chỉ trên cùng browser/device, tối đa 20 phiên. Không có tài khoản/cloud; ảnh cũ không được phục hồi sau reload.
5. Collision camera dùng approximation của tán cây; cần tiếp tục playtest các góc cực đoan khi bổ sung model/level mới.

## E. Chạy và kiểm tra bản local

PowerShell, từ repo:

```powershell
Set-Location -LiteralPath 'C:\Users\Admin\Documents\Codex\2026-10-03\yaml-you-are-working-directly-inside\outputs\banori-world'
npm --prefix world-src run build
& 'C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4175 --bind 127.0.0.1
```

Mở `http://127.0.0.1:4175/#world`. Nếu đang dùng server cũ trỏ cùng repo, reload mạnh để nhận manifest mới.

Kiểm tra: chọn lớp/độ khó → bắt đầu → di chuyển/xoay → chụp giỏ → giải toán/gợi ý → xem kỹ năng/XP → tiếp tục khu mới. Pause để mở lại hướng dẫn, đổi thời tiết hoặc tải ảnh. Thoát/reload rồi tiếp tục phiên lưu. Characters và Brand phải là hai trang khác nhau; View gameplay demo mở World.

**Không push/deploy.** Bản này là nâng cấp demo V2 có thể kiểm tra local; các giới hạn model và hiệu năng nêu trên vẫn cần công việc tiếp theo trước khi gọi là bản thương mại hoàn chỉnh.
