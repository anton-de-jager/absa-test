using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using absa.web.Models;

namespace absa.web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhonebooksController : ControllerBase
    {
        private readonly PhonebookContext _context;

        public PhonebooksController(PhonebookContext context)
        {
            _context = context;
        }

        // GET: api/Phonebooks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Phonebook>>> GetPhonebookItems()
        {
            return await _context.PhonebookItems.ToListAsync();
        }

        // GET: api/Phonebooks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Phonebook>> GetPhonebook(long id)
        {
            var phonebook = await _context.PhonebookItems.FindAsync(id);

            if (phonebook == null)
            {
                return NotFound();
            }

            return phonebook;
        }

        // PUT: api/Phonebooks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhonebook(long id, Phonebook phonebook)
        {
            if (id != phonebook.Id)
            {
                return BadRequest();
            }

            _context.Entry(phonebook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhonebookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Phonebooks
        [HttpPost]
        public async Task<ActionResult<Phonebook>> PostPhonebook(Phonebook phonebook)
        {
            _context.PhonebookItems.Add(phonebook);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhonebook", new { id = phonebook.Id }, phonebook);
        }

        // DELETE: api/Phonebooks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Phonebook>> DeletePhonebook(long id)
        {
            var phonebook = await _context.PhonebookItems.FindAsync(id);
            if (phonebook == null)
            {
                return NotFound();
            }

            _context.PhonebookItems.Remove(phonebook);
            await _context.SaveChangesAsync();

            return phonebook;
        }

        private bool PhonebookExists(long id)
        {
            return _context.PhonebookItems.Any(e => e.Id == id);
        }
    }
}
