/** Domain port — implement with Supabase/Prisma later */
export interface AuditsRepositoryPort {
  save(audit: unknown): Promise<{ id: string; shareId: string }>;
  findPublicByShareId(shareId: string): Promise<unknown | null>;
}
