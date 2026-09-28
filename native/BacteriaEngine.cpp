#include <vector>
#include <cmath>
#include <cstdlib>

struct Point {
    float x, y;
    float vx, vy;
};

struct Blob {
    std::vector<Point> points;
    float centerX, centerY;
    float vx, vy;
    float phase;
};

std::vector<Blob> blobs;
float timer = 0.0f;

extern "C" {

// إعادة تعيين الرسم
void reset_drawing() {
    blobs.clear();
    timer = 0.0f;
}

// إضافة نقطة مرسومة
void add_point(float x, float y) {
    if (blobs.empty()) {
        Blob newBlob;
        newBlob.centerX = x;
        newBlob.centerY = y;
        newBlob.vx = ((rand() % 100) / 50.0f - 1.0f) * 2.0f;
        newBlob.vy = ((rand() % 100) / 50.0f - 1.0f) * 2.0f;
        newBlob.phase = (rand() % 100) / 10.0f;
        blobs.push_back(newBlob);
    }
    blobs[0].points.push_back({x, y, 0, 0});
}

// تحديث الفيزياء حركة يمين/يسار + جيلي + انقسام كل 3 ثواني
void update_physics(float dt) {
    timer += dt;
    bool shouldSplit = false;

    if (timer >= 3.0f && !blobs.empty() && blobs.size() < 16) {
        shouldSplit = true;
        timer = 0.0f;
    }

    size_t currentSize = blobs.size();
    for (size_t i = 0; i < currentSize; ++i) {
        auto& b = blobs[i];
        b.phase += dt * 5.0f;

        // حركة عشوائية واهتزاز
        b.centerX += b.vx + sin(b.phase) * 1.5f;
        b.centerY += b.vy + cos(b.phase) * 1.5f;

        // ارتداد من الحواف
        if (b.centerX < 50 || b.centerX > 350) b.vx *= -1;
        if (b.centerY < 50 || b.centerY > 600) b.vy *= -1;

        // تشويه الجيلي للأقاط
        for (auto& p : b.points) {
            p.x += b.vx + sin(b.phase + p.y * 0.05f) * 0.8f;
            p.y += b.vy + cos(b.phase + p.x * 0.05f) * 0.8f;
        }

        // الانقسام الجيلي!
        if (shouldSplit) {
            Blob child = b;
            child.centerX += 30.0f;
            child.vx = -b.vx + ((rand() % 10) / 10.0f);
            child.vy = -b.vy + ((rand() % 10) / 10.0f);
            for (auto& p : child.points) {
                p.x += 30.0f;
            }
            blobs.push_back(child);
        }
    }
}

}
