import Card from './Card';

/** Player represents a single user. */
export default class Player {
  /** Each user is given a unique ID. */
  public id!: string;

  /** Each user picks a username (not necessarily unique). */
  public username!: string;

  /** Each user has a score. */
  public score!: number;
}
