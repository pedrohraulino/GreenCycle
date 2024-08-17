using LocaisReciclagem.Model;
using Microsoft.EntityFrameworkCore;

namespace LocaisReciclagem.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<LocaisReciclagemModel> Local { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<LocaisReciclagemModel>()
          .HasKey(l => l.LocalReciclagem_Id);

      base.OnModelCreating(modelBuilder);
    }
  }

}
