using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineTests.Repository.Model
{
    [Table("ccComplexity")]
    public class Complexity
    {
        [Key, Column("id")]
        public byte Id { get; set; }

        [Column("complexity"), StringLength(50)]
        public string Name { get; set; }

        [Column("code"), StringLength(1)]
        public string Code { get; set; }

        [Column("ordinal")]
        public int Ordinal { get; set; }
    }
}
