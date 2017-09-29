/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import math.Vec2
class MathUtils {

    static map(num, min1, max1, min2, max2, round, constrainMin, constrainMax) {
        if (round == null) { round = false; }
        if (constrainMin == null) { constrainMin = true; }
        if (constrainMax == null) { constrainMax = true; }
        if (constrainMin && (num < min1)) { return min2; }
        if (constrainMax && (num > max1)) { return max2; }

        const num1 = (num - min1) / (max1 - min1);
        const num2 = (num1 * (max2 - min2)) + min2;
        if (round) { return Math.round(num2); }
        return num2;
    }

    static lineIntersect(line1, line2) {
        let onLine1 = false;
        let onLine2 = false;
        const result = {
            x: 0,
            y: 0
        };

        const denominator = ((line2.ey - line2.sy) * (line1.ex - line1.sx)) - ((line2.ex - line2.sx) * (line1.ey - line1.sy));

        if (denominator === 0) {
            return false;
        }

        let a = line1.sy - line2.sy;
        let b = line1.sx - line2.sx;

        const numerator1 = ((line2.ex - line2.sx) * a) - ((line2.ey - line2.sy) * b);
        const numerator2 = ((line1.ex - line1.sx) * a) - ((line1.ey - line1.sy) * b);

        a = numerator1 / denominator;
        b = numerator2 / denominator;

        result.x = line1.sx + (a * (line1.ex - line1.sx));
        result.y = line1.sy + (a * (line1.ey - line1.sy));

        if ((a > 0) && (a < 1)) {
            onLine1 = true;
        }

        if ((b > 0) && (b < 1)) {
            onLine2 = true;
        }

        if ((onLine1 === true) && (onLine2 === true)) {
            return result;
        }

        return false;
    }
}
