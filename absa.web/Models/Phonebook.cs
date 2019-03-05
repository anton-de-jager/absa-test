using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace absa.web.Models
{
    public class Phonebook
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string ImageUrl { get; set; }
    }
}
