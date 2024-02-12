using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Models.Database.Postgres;

public class LocationData
{
    [Required]
    [Key]
    public string LocationName { get; set; }

    public string FriendlyLocationName { get; set; }

    public double LocationLatitude { get; set; }

    public double LocationLongitude { get; set; }

    public int ColoId { get; set; }

    public string IATA { get; set; }
    public DateTime LastUpdate { get; set; }

    public DateTime LastChange { get; set; }

    public bool Enabled { get; set; }

    public double ColoLatitude { get; set; }

    public double ColoLongitude { get; set; }
}