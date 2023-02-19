# `Gun`
Points and shoots in the direction of your mouse.

## Another Method For `Vector2`

```js
/** Returns the angle represented by the vector.
 *  @return {number} The angle in radians. */
toAngle() { return Math.atan2(this.#y, this.#x); }
```

## A Rotated `Sprite`

```js
/** Draw a sprite from the current frame at a position rotated around a point.
 *  @param {CanvasRenderingContext2D} context - The context to draw on.
 *  @param {Vector2} pos - The position to draw the sprite.
 *  @param {Vector2} rotatePos - The position of the point in which the sprite
 *     is rotated around. Note that the position is RELATIVE to the position
 *     to draw the sprite.
 *  @param {number} angle - The angle of rotation in radians. Assumes that
 *     positive angles correspond to the clockwise direction. */
drawRotated(context, pos, rotatePos, angle) {
    context.save();
    context.translate(pos.x + rotatePos.x, pos.y + rotatePos.y);
    context.rotate(-angle);
    context.drawImage(this.#image, this.#frame.x * this.#dimensions.x, this.#frame.y * this.#dimensions.y, 
        this.#dimensions.x, this.#dimensions.y, pos.x - rotatePos.x, pos.y - rotatePos.y, this.#dimensions.x, this.#dimensions.y);
    context.restore();
}
```

## Mouse-Dependent Rotation and the Barrel
Once sprites can be rotated, it is time to have it rotate to always face the mouse. And with a
rotating gun, the barrel (where the bullets come from) needs to rotate as well.

**Changes to Implement**
1) Have the `Gun` keep track of its last mouse position called `lastMousePos`.
2) At this point, you can find the direction vector by normalizing `mousePos.subCopy(pos.addCopy(new Vector2(0, this.movable.dimensions.y / 2)))`.
This vector will be called `dir`.

**Changes to Implement**
1) Change the `Gun`'s `draw` method to use `drawRotated`.
2) Change the `Gun`'s `addBullet` method. To find out the point to spawn the projectile, do
`pos.addCopy(direction.mulScalar(this.movable.dimensions.x))`. Velocity is found in a similar
manner.
