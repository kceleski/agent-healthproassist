
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSearchResults } from "@/services/searchResultService";
import { useAuth } from "@/context/AuthContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Map } from "lucide-react";

const SavedSearchesPage = () => {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadSearches = async () => {
      if (!user?.id) return;
      
      try {
        const results = await getSearchResults(user.id);
        setSearches(results);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load saved searches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSearches();
  }, [user?.id]);

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <Helmet>
        <title>Saved Searches - HealthProAssist</title>
      </Helmet>

      <Card>
        <CardHeader>
          <CardTitle>Saved Searches</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading saved searches...</div>
          ) : searches.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">No saved searches found</p>
              <Button asChild>
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Start a New Search
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Search Query</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Facility Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searches.map((search) => (
                  <TableRow key={search.id}>
                    <TableCell>{search.query}</TableCell>
                    <TableCell>{search.location || "N/A"}</TableCell>
                    <TableCell>{search.facility_type || "Any"}</TableCell>
                    <TableCell>
                      {format(new Date(search.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/map?q=${encodeURIComponent(search.query)}`}>
                            <Map className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedSearchesPage;
