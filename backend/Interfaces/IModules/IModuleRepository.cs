using didaktos.backend.Models;

namespace didaktos.backend.Interfaces
{
    public interface IModuleRepository
    {
        Task<List<Module>> GetCourseModulesAsync(Guid courseId);
        Task<Module> CreateModuleAsync(Module module);
        Task<Module?> GetModuleByIdAsync(Guid moduleId);
        Task<bool> ModuleExistsAsync(Guid moduleId);
        Task<Guid> GetModuleCourseIdAsync(Guid moduleId);
        Task<Module> UpdateModuleAsync(Module module);
        Task<bool> DeleteModuleAsync(Guid moduleId);
    }
}
