/** The Health class provides methods for manipulating health. Also features optional
 *  defense and armor attributes which can modify how much health is decreased. 
 *  @memberof Components */
class Health {
    /** @type {number} */
    #maxHealth
    /** @type {number} */
    #currentHealth
    /** @type {number} */
    #healthiness
    /** @type {number} */
    #defense
    /** @type {number} */
    #armor

    /** Create the Health component.
     *  @param {number} health - The starting amount of health.
     *  @param {number} defense - The starting amount of defense.
     *  @param {number} armor - The starting amount of armor. */
    constructor(health, healthiness = 1, defense = 0, armor = 0) {
        this.#maxHealth = health;
        this.#currentHealth = health;
        this.#healthiness = healthiness;
        this.#defense = defense;
        this.#armor = armor;
    }

    /** Sets the defense.
     *  @param {number} defense - The defense. */
    set defense(defense) { this.#defense = defense; }

    /** Sets the armor.
     *  @param {number} armor - The armor. */
    set armor(armor) { this.#armor = armor; }

    /** Increase health without taking healthiness into account.
     *  @param {number} health - The health to gain. */
    gainDirectHealth(health) {
        this.#currentHealth = Math.min(this.#currentHealth + health, this.#maxHealth);
    }

    /** Increase health. The actual amount of health gained
     *  is modified by the healthiness stat.
     *  @param {number} health - The health to gain. */
    gainHealth(health) {
        this.#currentHealth = Math.min(this.#currentHealth + (health * this.#healthiness), this.#maxHealth);
    }

    /** Decrease the health by the amount of provided damage
     *  without taking into account the defense and armor stats.
     *  @param {number} damage - The damage to take. */
    takeDirectDamage(damage) { 
        this.#currentHealth = Math.max(this.#currentHealth - damage, 0); 
    }

    /** Decrease the health by the amount of provided damage.
     *  The damage is modified by the defense and armor stats 
     *  before applying to the actual health.
     *  @param {number} damage - The damage to take. */
    takeDamage(damage) {
        let actualDamage = Math.max(damage - this.#defense, 1);

        const remainingArmor = this.#armor - actualDamage;
        this.#armor = Math.max(remainingArmor, 0);
        actualDamage = (remainingArmor < 0) ? -remainingArmor : 0;

        this.#currentHealth = Math.max(this.#currentHealth - actualDamage, 0);
    }
}

export default Health;
