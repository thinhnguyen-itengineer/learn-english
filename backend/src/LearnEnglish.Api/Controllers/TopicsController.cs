using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/topics")]
public class TopicsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TopicsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TopicDto>>> GetTopics([FromQuery] string? difficulty)
    {
        var query = _context.Topics
            .Where(t => t.IsActive);

        if (!string.IsNullOrWhiteSpace(difficulty))
        {
            query = query.Where(t => t.DifficultyLevel.ToLower() == difficulty.ToLower());
        }

        var topics = await query
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new TopicDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                Description = t.Description,
                IconName = t.IconName,
                DifficultyLevel = t.DifficultyLevel,
                WordCount = t.Words.Count,
                SentenceCount = t.Sentences.Count
            })
            .ToListAsync();

        return Ok(topics);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TopicDto>> GetTopic(Guid id)
    {
        var topic = await _context.Topics
            .Where(t => t.Id == id)
            .Select(t => new TopicDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                Description = t.Description,
                IconName = t.IconName,
                DifficultyLevel = t.DifficultyLevel,
                WordCount = t.Words.Count,
                SentenceCount = t.Sentences.Count
            })
            .FirstOrDefaultAsync();

        if (topic == null)
        {
            return NotFound("Chủ đề không tồn tại.");
        }

        return Ok(topic);
    }
}
